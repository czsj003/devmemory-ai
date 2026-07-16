"""create interview preps table

Revision ID: 14c8a9d2e6f1
Revises: e47f7f29f2e1
Create Date: 2026-07-16 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "14c8a9d2e6f1"
down_revision: Union[str, Sequence[str], None] = "e47f7f29f2e1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "interview_preps",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("project_pitch", sa.Text(), nullable=True),
        sa.Column("technical_explanation", sa.Text(), nullable=True),
        sa.Column("resume_bullets", sa.Text(), nullable=True),
        sa.Column("debugging_story", sa.Text(), nullable=True),
        sa.Column("architecture_explanation", sa.Text(), nullable=True),
        sa.Column("star_answer", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["project_id"],
            ["projects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_interview_preps_id"), "interview_preps", ["id"], unique=False)
    op.create_index(
        op.f("ix_interview_preps_project_id"),
        "interview_preps",
        ["project_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_interview_preps_project_id"), table_name="interview_preps")
    op.drop_index(op.f("ix_interview_preps_id"), table_name="interview_preps")
    op.drop_table("interview_preps")
